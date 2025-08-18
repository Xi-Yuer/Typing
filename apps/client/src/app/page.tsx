'use client';
import PlasmaWaveV2 from '@/blocks/PlasmaWaveV2/PlasmaWaveV2';
export default function Page() {
  return (
    <div className='bg-black h-[100vh] w-screen'>
      <PlasmaWaveV2 yOffset={-300} xOffset={0} rotationDeg={-30} />
    </div>
  );
}
