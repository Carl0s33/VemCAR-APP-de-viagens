// Hook to play audio feedback
const useAudio = (url) => {
  const audio = new Audio(url);

  const play = () => {
    audio.currentTime = 0; // Reset to start
    audio.play();
  };

  return play;
};

export default useAudio;
