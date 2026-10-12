import { contentFor, metadataFor } from "@/lib/content/public";
import { ContentView } from "@/templates/ContentView";
export async function generateMetadata() { return metadataFor("/despre-noi/"); }
export default async function Page() { return <ContentView {...await contentFor("/despre-noi/")} />; }
