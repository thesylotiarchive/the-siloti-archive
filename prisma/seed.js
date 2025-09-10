const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.page.upsert({
    where: { slug: "people" },
    update: {},
    create: {
      slug: "people",
      title: "People Behind the Archive",
      sections: {
        title: "People Behind the Archive",
        intro:
          "The Syloti Archive is made possible by a dedicated team of contributors and collaborators.",
        people: [
          {
            name: "Abdullah",
            role: "Founder",
            image: "/avatars/avatar.png",
            description:
              "Abdullah envisioned The Syloti Archive as a platform to preserve and celebrate Sylheti culture for future generations.",
          },
          {
            name: "Istiak Ahmed",
            role: "Cultural Research Lead",
            image: "/avatars/avatar.png",
            description:
              "Istiak leads the cultural research efforts, gathering stories, traditions, and historical knowledge of Sylheti heritage.",
          },
          {
            name: "Nasir Uddin",
            role: "Audio Archivist",
            image: "/avatars/avatar.png",
            description:
              "Nasir focuses on collecting and preserving audio archives — from oral histories to folk songs — ensuring they remain accessible.",
          },
        ],
      },
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
