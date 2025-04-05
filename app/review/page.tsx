// import Link from "next/link";
// import Image from "next/image";

// // Mock data - replace with your actual data fetching
// const getSchools = async (): Promise<School[]> => {
//   return [
//     {
//       id: 1,
//       slug: "harvard-university",
//       name: "Harvard University",
//       location: "Cambridge, MA",
//       rating: 4.8,
//       image: "/placeholder.svg?height=200&width=300",
//       description: "One of the most prestigious universities in the world.",
//     },
//     {
//       id: 2,
//       slug: "stanford-university",
//       name: "Stanford University",
//       location: "Stanford, CA",
//       rating: 4.7,
//       image: "/placeholder.svg?height=200&width=300",
//       description: "A leading research university in Silicon Valley.",
//     },
//     {
//       id: 3,
//       slug: "mit",
//       name: "Massachusetts Institute of Technology",
//       location: "Cambridge, MA",
//       rating: 4.9,
//       image: "/placeholder.svg?height=200&width=300",
//       description: "World-renowned for engineering and technology programs.",
//     },
//     {
//       id: 4,
//       slug: "oxford-university",
//       name: "Oxford University",
//       location: "Oxford, UK",
//       rating: 4.8,
//       image: "/placeholder.svg?height=200&width=300",
//       description: "The oldest university in the English-speaking world.",
//     },
//     {
//       id: 5,
//       slug: "caltech",
//       name: "California Institute of Technology",
//       location: "Pasadena, CA",
//       rating: 4.7,
//       image: "/placeholder.svg?height=200&width=300",
//       description:
//         "A world-renowned science and engineering research institution.",
//     },
//     {
//       id: 6,
//       slug: "princeton-university",
//       name: "Princeton University",
//       location: "Princeton, NJ",
//       rating: 4.6,
//       image: "/placeholder.svg?height=200&width=300",
//       description: "Known for academic excellence and beautiful campus.",
//     },
//   ];
// };

// export default async function Home() {
//   const schools = await getSchools();

//   return (
//     <main className="container mx-auto px-4 py-8">
//       <h1 className="mb-8 text-3xl font-bold text-white">School Reviews</h1>

//       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {schools.map((school) => (
//           <Link
//             key={school.id}
//             href={`/schools/${school.slug}`}
//             className="group block overflow-hidden rounded-lg bg-gray-800 transition-all hover:ring-2 hover:ring-primary"
//           >
//             <div className="relative h-48 w-full overflow-hidden">
//               <Image
//                 src={school.image || "/placeholder.svg"}
//                 alt={school.name}
//                 fill
//                 className="object-cover transition-transform duration-300 group-hover:scale-105"
//               />
//               <div className="absolute right-2 top-2 rounded-full bg-gray-900 px-2 py-1 text-sm font-bold text-yellow-400">
//                 ★ {school.rating}
//               </div>
//             </div>
//             <div className="p-4">
//               <h2 className="text-xl font-bold text-white">{school.name}</h2>
//               <p className="text-sm text-gray-400">{school.location}</p>
//               <p className="mt-2 line-clamp-2 text-gray-300">
//                 {school.description}
//               </p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </main>
//   );
// }
