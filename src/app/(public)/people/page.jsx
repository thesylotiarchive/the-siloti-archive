const people = [
    {
      name: "Abdullah",
      role: "Founder",
      image: "/avatars/avatar.png",
    },
    {
      name: "Istiak Ahmed",
      role: "Cultural Research Lead",
      image: "/avatars/avatar.png",
    },
    {
      name: "Nasir Uddin",
      role: "Audio Archivist",
      image: "/avatars/avatar.png",
    },
  ];
  
  export default function PeoplePage() {
    return (
      <main className="max-w-5xl mx-auto px-4 py-20">
        <h1 className="relative  text-3xl sm:text-4xl font-bold text-[#1276AB] text-center mb-10 after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-[3px] after:bg-[#D4A574]">
          People Behind the Archive
        </h1>
  
        <p className="text-muted-foreground mb-12 text-lg leading-relaxed">
          The Syloti Archive is made possible by a dedicated team of contributors and collaborators.
        </p>
  
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {people.map((person, i) => (
            <div
              key={i}
              className="bg-card border border-muted rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <img
                src={person.image}
                alt={person.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4 shadow"
              />
              <div className="text-center">
                <h3 className="text-lg font-semibold">{person.name}</h3>
                <p className="text-sm text-muted-foreground">{person.role}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }
  