
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/db"; // adjust if your prisma client is elsewhere
// import { verifyAdmin } from "@/lib/auth"; // assumes you have middleware-like helper

// export async function DELETE(req, { params }) {
//   const user = await verifyAdmin(req);
//   if (!user) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const categoryId = params.id;

//   try {
//     await prisma.category.delete({
//       where: { id: categoryId },
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Delete category failed:", error);
//     return NextResponse.json({ message: "Failed to delete category" }, { status: 500 });
//   }
// }
