import Image from "next/image";

interface GalleryProps {
  imageKendaraan: {
    url_gambar: string;
  }[];
}

export default function Gallery({ imageKendaraan = [] }: GalleryProps) {
  return (
    <div className="px-8 md:px-16 lg:px-24 mx-auto py-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 grid-rows-[250px_250px] gap-6">
        <div className="xl:col-span-2 xl:row-span-2 relative overflow-hidden rounded-3xl">
          <Image
            src={imageKendaraan?.[0]?.url_gambar || "/emptyImage.jpg"}
            alt="Empty Image"
            quality={100}
            fill
            className="object-contain"
          />
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src={imageKendaraan?.[1]?.url_gambar || "/emptyImage.jpg"}
            alt="Empty Image"
            quality={100}
            fill
            className="object-cover"
          />
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src={imageKendaraan?.[2]?.url_gambar || "/emptyImage.jpg"}
            alt="Empty Image"
            quality={100}
            fill
            className="object-cover"
          />
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src={imageKendaraan?.[3]?.url_gambar || "/emptyImage.jpg"}
            alt="Empty Image"
            quality={100}
            fill
            className="object-cover"
          />
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src={imageKendaraan?.[4]?.url_gambar || "/emptyImage.jpg"}
            alt="Empty Image"
            quality={100}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
