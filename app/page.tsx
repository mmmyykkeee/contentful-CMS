import { createClient } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Document } from "@contentful/rich-text-types";
import Image from "next/image";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

async function fetchHomepageData() {
  const res = await client.getEntries({ content_type: "homepage" });
  return res.items.map((item) => item.fields);
}

interface HomePageFields {
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
  const homepageData = await fetchHomepageData();

  if (!homepageData || homepageData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No data found
      </div>
    );
  }

  const { homepageTitle, homepageDesc, backgroundImg } =
    homepageData[0] as unknown as HomePageFields;
  const imageUrl = "https:" + backgroundImg.fields.file.url;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-black absolute inset-0 opacity-[0.5] z-[1]"></div>
      <h1 className="text-3xl font-bold z-[2]">{homepageTitle}</h1>
      <div className="mt-4 text-xl z-[2]">
        {documentToReactComponents(homepageDesc)}
      </div>
      <div className="mt-4 absolute inset-0 z-[-1] h-screen">
        <Image
          src={imageUrl}
          alt="hero"
          width={backgroundImg.fields.file.details.image.width}
          height={backgroundImg.fields.file.details.image.height}
        />
      </div>
    </div>
  );
}
