// // HeroCards.tsx
// import myPhoto from "../assets/SEOtron_vector1_final.png";

// export const HeroCards = () => {
//   return (
//     <div className="flex justify-center items-center h-[500px] w-[700px] mx-auto">
//       <img
//         src={myPhoto}
//         alt="My Photo"
//         className="rounded-xl object-cover w-full h-full"
//       />
//     </div>
//   );
// };
// HeroCards.tsx
import myVideo from "../assets/SEOtron_final_motiongraphics.mp4";

export const HeroCards = () => {
  return (
    <div className="relative h-[500px] w-[700px] mx-auto rounded-xl overflow-hidden">
      {/* 1. The Video (base layer) */}
      <video
        src={myVideo}
        autoPlay
        loop
        muted
        playsInline
        className="object-cover w-full h-full"
      />

      {/* 2. The Blur Overlay (top layer) */}
      {/* This div sits on top and applies a blur, but only on the sides, thanks to the mask. */}
      <div
        className="absolute inset-0 backdrop-blur-md [mask-image:linear-gradient(to_right,black_0%,transparent_25%,transparent_75%,black_100%)]"
        // Adding -webkit-mask-image for Safari compatibility
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, transparent 25%, transparent 75%, black 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
};
