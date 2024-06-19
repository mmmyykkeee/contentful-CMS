import { createClient } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Document } from "@contentful/rich-text-types";
import Image from "next/image";

// what to change
// homepageTitle
// homepageDesc
// backgroundImg

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

async function fetchData() {
  const res = await client.getEntries({ content_type: "homepage" });
  return res.items.map((item) => item.fields);
}

interface pageFields {
  homepageTitle: string;
  homepageDesc: Document;
  backgroundImg: {
    fields: {
      file: {
        url: string;
        details: {
          image: {
            width: number;
            height: number;
          };
        };
      };
    };
  };
}

export default async function Home() {
  const fetchedData = await fetchData();

  if (!fetchedData || fetchedData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No data found
      </div>
    );
  }

  const { homepageTitle, homepageDesc, backgroundImg } =
    fetchedData[0] as unknown as pageFields;
  const imageUrl = "https:" + backgroundImg.fields.file.url;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      <div className="bg-black absolute inset-0 opacity-[0.5] z-[1]"></div>
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold z-[2] text-white w-3/4 text-center">
  {homepageTitle}
</h1>
<div className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl z-[2] text-white w-3/4 text-center">
  {documentToReactComponents(homepageDesc)}
</div>

      <div
        className="mt-4 absolute inset-0 z-[-1] h-screen"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
        }}
      >
      </div>
    </div>
  );
}
