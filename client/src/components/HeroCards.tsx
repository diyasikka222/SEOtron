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
import myVideo from "../assets/SEOtron_infoGraphics.mp4";

export const HeroCards = () => {
  return (
    <div className="flex justify-center items-center h-[500px] w-[700px] mx-auto">
      <video
        src={myVideo}
        autoPlay
        loop
        muted
        playsInline
        className="rounded-xl object-cover w-full h-full"
      />
    </div>
  );
};
