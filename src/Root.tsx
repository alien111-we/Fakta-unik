import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const FPS = 30;
const SCENE_FRAMES = 150; // 5 detik per adegan

type SceneData = {
  label: string;
  title: string;
  body: string;
  bg1: string;
  bg2: string;
};

const scenes: SceneData[] = [
  {
    label: 'FAKTA UNIK',
    title: 'Kenapa nyamuk suka menggigitmu?',
    body: 'Ternyata bukan kebetulan.',
    bg1: '#0f172a',
    bg2: '#1e3a8a',
  },
  {
    label: '1',
    title: 'Yang menggigit cuma betina',
    body: 'Nyamuk betina butuh protein dari darah untuk mematangkan telurnya.',
    bg1: '#3b0764',
    bg2: '#9d174d',
  },
  {
    label: '2',
    title: 'Mereka mencium napasmu',
    body: 'Karbon dioksida (CO2) dari napasmu bisa terdeteksi dari jarak cukup jauh.',
    bg1: '#064e3b',
    bg2: '#0e7490',
  },
  {
    label: '3',
    title: 'Bau kulit dan panas tubuh',
    body: 'Keringat, bakteri di kulit, dan suhu tubuh membuatmu lebih mudah dilacak.',
    bg1: '#7c2d12',
    bg2: '#b45309',
  },
  {
    label: '4',
    title: 'Soal golongan darah',
    body: 'Beberapa studi menyebut golongan O lebih sering digigit, tapi buktinya masih terbatas.',
    bg1: '#1e1b4b',
    bg2: '#5b21b6',
  },
  {
    label: 'JADI',
    title: 'Nyamuk bukan asal gigit',
    body: 'Ikuti untuk fakta unik lainnya!',
    bg1: '#0f172a',
    bg2: '#be123c',
  },
];

const TOTAL_FRAMES = scenes.length * SCENE_FRAMES;

const Scene: React.FC<SceneData> = ({label, title, body, bg1, bg2}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({frame, fps, config: {damping: 12}});
  const titleY = interpolate(frame, [0, 20], [70, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bodyOpacity = interpolate(frame, [25, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bodyY = interpolate(frame, [25, 50], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [SCENE_FRAMES - 12, SCENE_FRAMES], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${bg1}, ${bg2})`,
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 90,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: 110,
          background: 'rgba(255,255,255,0.15)',
          border: '6px solid rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: label.length > 2 ? 44 : 110,
          fontWeight: 800,
          textAlign: 'center',
          transform: `scale(${pop})`,
          marginBottom: 80,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 92,
          fontWeight: 800,
          lineHeight: 1.15,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 60,
          fontSize: 54,
          lineHeight: 1.4,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.9)',
          opacity: bodyOpacity,
          transform: `translateY(${bodyY}px)`,
        }}
      >
        {body}
      </div>
    </AbsoluteFill>
  );
};

const MosquitoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, TOTAL_FRAMES], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#0f172a'}}>
      {scenes.map((scene, i) => (
        <Sequence
          key={i}
          from={i * SCENE_FRAMES}
          durationInFrames={SCENE_FRAMES}
        >
          <Scene {...scene} />
        </Sequence>
      ))}

      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 14,
          width: `${progress}%`,
          background: 'white',
        }}
      />
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="NyamukGigit"
      component={MosquitoVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};