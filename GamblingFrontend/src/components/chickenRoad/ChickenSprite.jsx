const ChickenSprite = ({ position, multiplierRefs, scrollContainer, gameState }) => {
  // Calculate the visual position based on the multiplier position
  const getChickenLeft = () => {
    if (!multiplierRefs.current[position] || !scrollContainer.current) {
      return 28; // Default position
    }

    const multiplierElement = multiplierRefs.current[position];
    const containerElement = scrollContainer.current;

    const multiplierRect = multiplierElement.getBoundingClientRect();
    const containerRect = containerElement.getBoundingClientRect();

    // Calculate position relative to the container
    const relativeLeft = multiplierRect.left - containerRect.left + (multiplierRect.width / 2);

    return relativeLeft;
  };

  return (
    <div
      className="absolute bottom-5 w-14 h-14 transition-all duration-500 ease-in-out z-20"
      style={{
        left: `${getChickenLeft() - 28}px`, // Center the chicken (28px is half of 56px width)
        transform: 'translateY(0)'
      }}
    >
      {gameState == "gameOver" ?
        <div>
          <div className="absolute bottom-0 left-[-4rem] z-50">
            <img
              src="/fire.gif" // If placed in public folder
              alt="fire"
              className="object-contain min-w-[12rem]"
            />
          </div>
          <img
            src="/chicken-dead.png"
            alt="chicken"
            className="object-contain drop-shadow-lg min-w-[6rem]"
            style={{
              animation: 'slideUpDown 2s ease-in-out',
            }} />
          <style>
            {`
          @keyframes slideUpDown {
            0% {
              transform: translateY(0px); /* Start below */
            }
            50% {
              transform: translateY(-100px); /* Original position */
            }
            100% {
              transform: translateY(0px); /* Go back below */
            }
          }
        `}
          </style>
        </div>
        :
        <div>
          <img
            src="/chicken.webp"
            alt="chicken"
            className="w-14 h-14 object-contain drop-shadow-lg" />
        </div>}
      {/* <img
        src="/chicken.webp"
        alt="chicken"
        className="w-14 h-14 object-contain drop-shadow-lg"
      /> */}
    </div>
  );
};

export default ChickenSprite;