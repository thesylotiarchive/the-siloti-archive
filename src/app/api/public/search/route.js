import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function getAllDescendantFolderIds(prisma, parentId) {
  if (!parentId) return [];
  const queue = [parentId];
  const allIds = [parentId];
  

  while (queue.length > 0) {
    const current = queue.shift();
    const children = await prisma.folder.findMany({
      where: { parentId: current },
      select: { id: true },
    });
    for (const child of children) {
      allIds.push(child.id);
      queue.push(child.id);
    }
  }

  return allIds;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    let total = 0;

    let collectionId = searchParams.get("collectionId");
    if (collectionId === "null" || collectionId === "" || collectionId === undefined) {
      collectionId = null;
    }

    // ✅ get all descendant folders
    let folderIds = [];
    if (collectionId) {
      folderIds = await getAllDescendantFolderIds(prisma, collectionId);
    }

    // ✅ build filters safely
    const filters = { status: "PUBLISHED" };

    // MediaType (enum)
    const mediaTypeParam = searchParams.get("mediaType");
    if (mediaTypeParam) {
      const mediaTypes = mediaTypeParam.split(",").map((v) => v.trim()).filter(Boolean);
      if (mediaTypes.length > 0) {
        filters.mediaType = { in: mediaTypes };
      }
    }

    // Language (string)
    const languageParam = searchParams.get("language");
    if (languageParam) {
      const languages = languageParam.split(",").map((v) => v.trim()).filter(Boolean);
      if (languages.length > 0) {
        filters.language = { in: languages };
      }
    }

    // Tags (relation)
    const tagsParam = searchParams.get("tags");
    if (tagsParam) {
      const tags = tagsParam.split(",").map((v) => v.trim()).filter(Boolean);
      if (tags.length > 0) {
        filters.tags = { some: { name: { in: tags } } };
      }
    }

    // Folder scope
    if (folderIds.length > 0) {
      filters.folderId = { in: folderIds };
    }

    let results = [];

    // ✅ If filters are applied, return only media items
    const filtersApplied = mediaTypeParam || languageParam || tagsParam;

    if (filtersApplied) {
      results = await prisma.mediaItem.findMany({
        where: {
          ...filters,
          ...(q
            ? {
                OR: [
                  { title: { startsWith: q, mode: "insensitive" } },
                  { title: { contains: q, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      });

      results = results.map((m) => ({ ...m, type: "media" }));
    } else {
      // ✅ Search Mode (mix collections + media)
      let mediaItems = [];
      let collections = [];

      if (q) {
        // ---- MEDIA ----
        const mediaStarts = await prisma.mediaItem.findMany({
          where: { ...filters, title: { startsWith: q, mode: "insensitive" } },
          orderBy: { createdAt: "desc" },
        });

        const mediaContains = await prisma.mediaItem.findMany({
          where: {
            ...filters,
            title: { contains: q, mode: "insensitive" },
            NOT: { title: { startsWith: q, mode: "insensitive" } },
          },
          orderBy: { createdAt: "desc" },
        });

        mediaItems = [...mediaStarts, ...mediaContains];

        // ---- COLLECTIONS ----
        const collectionStarts = await prisma.folder.findMany({
          where: {
            status: "PUBLISHED",
            name: { startsWith: q, mode: "insensitive" },
            ...(collectionId ? { parentId: collectionId } : { parentId: null }),
          },
          include: {
            mediaItems: { where: { status: "PUBLISHED" } },
            children: { where: { status: "PUBLISHED" } },
          },
          orderBy: { createdAt: "desc" },
        });

        const collectionContains = await prisma.folder.findMany({
          where: {
            status: "PUBLISHED",
            name: { contains: q, mode: "insensitive" },
            NOT: { name: { startsWith: q, mode: "insensitive" } },
            ...(collectionId ? { parentId: collectionId } : { parentId: null }),
          },
          include: {
            mediaItems: { where: { status: "PUBLISHED" } },
            children: { where: { status: "PUBLISHED" } },
          },
          orderBy: { createdAt: "desc" },
        });

        collections = [...collectionStarts, ...collectionContains];
      } else {
        // ---- Non-search mode ----
        mediaItems = await prisma.mediaItem.findMany({
          where: filters,
          orderBy: { createdAt: "desc" },
        });

        collections = await prisma.folder.findMany({
          where: {
            status: "PUBLISHED",
            ...(collectionId ? { parentId: collectionId } : { parentId: null }),
          },
          orderBy: { createdAt: "desc" },
          include: {
            mediaItems: { where: { status: "PUBLISHED" } },
            children: { where: { status: "PUBLISHED" } },
          },
        });
      }

      // ✅ Map results
      const mappedMedia = mediaItems.map((m) => ({ ...m, type: "media" }));
      const mappedCollections = collections.map((folder) => ({
        id: folder.id,
        name: folder.name,
        imageUrl: folder.image,
        itemCount: (folder.children?.length || 0) + (folder.mediaItems?.length || 0),
        type: "collection",
      }));

      total = mappedCollections.length + mappedMedia.length;

      // Merge + paginate
      results = [...mappedCollections, ...mappedMedia];
      const start = (page - 1) * limit;
      const end = start + limit;
      results = results.slice(start, end);
    }

    return NextResponse.json({
      results,
      pagination: {
        page,
        limit,
        total: total,
      },
    });
  } catch (error) {
    console.error("❌ Search API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
