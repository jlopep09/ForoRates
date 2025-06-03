import React from 'react';
import Button from '@mui/material/Button';
import MiniThreadCard from './MiniThreadCard';

export const ProfileLinkSection = ({
  threads,
  currentIndex,
  setCurrentIndex,
  onThreadSelect,   // ahora esperamos (threadId, indexReal)
  onCloseThread,    // idem: (threadId, indexReal)
  onDeleteThread
}) => {
  const handlePrev = () => {
    setCurrentIndex(prevIndex => Math.max(prevIndex - 4, 0));
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => Math.min(prevIndex + 4, threads.length - 4));
  };

  return (
    <div className='flex flex-row gap-3 justify-center items-center'>
      <Button onClick={handlePrev} disabled={currentIndex === 0}>Prev</Button>
      {threads.slice(currentIndex, currentIndex + 4).map((thread, idx) => {
        const indexReal = currentIndex + idx;
        return (
          <MiniThreadCard
            key={thread.id}
            thread={thread}
            onClick={() => onThreadSelect(thread.id, indexReal)}
            onClose={() => onCloseThread(thread.id, indexReal)}
            onDelete={() => onDeleteThread(thread.id, indexReal)}
          />
        );
      })}
      <Button onClick={handleNext} disabled={currentIndex + 4 >= threads.length}>Next</Button>
    </div>
  );
};
