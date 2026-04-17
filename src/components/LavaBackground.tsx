'use client'

export default function LavaBackground() {
  return (
    <>
      <style>{`
        .lava-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden}
        .lava-blob{position:absolute;border-radius:50%;will-change:transform;animation-timing-function:ease-in-out;animation-iteration-count:infinite}
        .lava-blob-1{width:60vw;height:60vw;background:radial-gradient(circle,rgba(232,93,58,0.55) 0%,rgba(232,93,58,0.18) 40%,transparent 65%);top:-20%;left:-15%;filter:blur(45px);animation:lava1 14s infinite}
        .lava-blob-2{width:55vw;height:55vw;background:radial-gradient(circle,rgba(45,127,249,0.4) 0%,rgba(45,127,249,0.12) 40%,transparent 65%);bottom:-15%;right:-10%;filter:blur(40px);animation:lava2 16s infinite}
        .lava-blob-3{width:50vw;height:50vw;background:radial-gradient(circle,rgba(245,166,35,0.45) 0%,rgba(245,166,35,0.14) 40%,transparent 65%);top:30%;left:25%;filter:blur:42px;animation:lava3 18s infinite}
        .lava-blob-4{width:48vw;height:48vw;background:radial-gradient(circle,rgba(168,85,247,0.3) 0%,rgba(168,85,247,0.08) 40%,transparent 65%);top:-5%;right:5%;filter:blur(50px);animation:lava4 15s infinite}
        .lava-blob-5{width:42vw;height:42vw;background:radial-gradient(circle,rgba(16,185,129,0.25) 0%,rgba(16,185,129,0.06) 40%,transparent 65%);bottom:10%;left:-5%;filter:blur(45px);animation:lava5 20s infinite}
        .lava-blob-6{width:38vw;height:38vw;background:radial-gradient(circle,rgba(232,93,58,0.35) 0%,rgba(245,166,35,0.1) 40%,transparent 65%);top:55%;right:20%;filter:blur(48px);animation:lava6 12s infinite}

        @keyframes lava1{0%,100%{transform:translate(0,0) scale(1)}20%{transform:translate(25vw,12vh) scale(1.25)}45%{transform:translate(-10vw,22vh) scale(0.85)}70%{transform:translate(20vw,-10vh) scale(1.18)}}
        @keyframes lava2{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(-22vw,-14vh) scale(1.2)}55%{transform:translate(18vw,-20vh) scale(0.88)}80%{transform:translate(-15vw,12vh) scale(1.12)}}
        @keyframes lava3{0%,100%{transform:translate(0,0) scale(1)}30%{transform:translate(-28vw,14vh) scale(1.3)}60%{transform:translate(20vw,-16vh) scale(0.78)}85%{transform:translate(-8vw,8vh) scale(1.1)}}
        @keyframes lava4{0%,100%{transform:translate(0,0) scale(1)}22%{transform:translate(15vw,20vh) scale(1.2)}50%{transform:translate(-25vw,8vh) scale(0.85)}78%{transform:translate(10vw,-18vh) scale(1.15)}}
        @keyframes lava5{0%,100%{transform:translate(0,0) scale(1)}35%{transform:translate(22vw,-15vh) scale(1.25)}65%{transform:translate(-18vw,18vh) scale(0.82)}90%{transform:translate(12vw,-5vh) scale(1.08)}}
        @keyframes lava6{0%,100%{transform:translate(0,0) scale(1)}28%{transform:translate(-20vw,-10vh) scale(1.15)}52%{transform:translate(25vw,15vh) scale(0.9)}76%{transform:translate(-12vw,-20vh) scale(1.22)}}

        .lava-noise{position:fixed;inset:-10rem;z-index:1;pointer-events:none;opacity:0.35;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");background-repeat:repeat;background-size:256px 256px;animation:grain 1.5s steps(3) infinite}
        @keyframes grain{0%,100%{transform:translate3d(0,9rem,0)}25%{transform:translate3d(-5rem,-4rem,0)}50%{transform:translate3d(7rem,2rem,0)}75%{transform:translate3d(-3rem,-7rem,0)}}

        .lava-frost{position:fixed;top:0;left:0;width:100%;height:100%;backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);background-color:rgba(250,248,245,0.45);z-index:1;pointer-events:none}

        @media(max-width:768px){
          .lava-blob{filter:blur(60px)!important}
          .lava-blob-1,.lava-blob-2,.lava-blob-3{width:80vw!important;height:80vw!important}
          .lava-blob-4,.lava-blob-5,.lava-blob-6{display:none}
        }

        @media(prefers-reduced-motion:reduce){
          .lava-blob{animation:none!important}
          .lava-noise{animation:none!important}
        }
      `}</style>

      <div className="lava-canvas">
        <div className="lava-blob lava-blob-1" />
        <div className="lava-blob lava-blob-2" />
        <div className="lava-blob lava-blob-3" />
        <div className="lava-blob lava-blob-4" />
        <div className="lava-blob lava-blob-5" />
        <div className="lava-blob lava-blob-6" />
      </div>
      <div className="lava-noise" />
      <div className="lava-frost" />
    </>
  )
}
