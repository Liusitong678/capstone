import React from 'react';

const AnimatedLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      
      {/* Container for the loader */}
      <div className="relative w-64 h-64">
        
        <style>{`
          /* Animation Definitions */
          @keyframes rotate-bg {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes sparkle {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.6); opacity: 0.7; }
          }

          /* Apply Animations */
          
          /* 1. Rotate the background blobs */
          #bg {
            transform-origin: 133.4px 133.4px; /* Center of the main circle */
            animation: rotate-bg 1.3s linear infinite;
          }

          /* 2. Sparkle the stars */
          /* transform-box: fill-box ensures they scale from their own center, not the SVG center */
          #star path {
            transform-box: fill-box;
            transform-origin: center;
          }

          #Star_1 {
            animation: sparkle 1s ease-in-out infinite;
          }
          
          #Star_3 {
            animation: sparkle 1s ease-in-out infinite 0.3s; /* Staggered delay */
          }

          #Star_4 {
            animation: sparkle 1s ease-in-out infinite 0.6s; /* Staggered delay */
          }
        `}</style>

        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 267 267" 
          fill="none"
          className="w-full h-full"
          style={{ width: '14rem' }}
        >
          <g id="wrap">
            {/* Background Group - Rotates via CSS */}
            <g id="bg">
              <g id="Ellipse 18" filter="url(#filter0_f_2003_18)">
                <circle cx="133.407" cy="133.407" r="99.1225" transform="rotate(58.73 133.407 133.407)" fill="url(#paint0_linear_2003_18)"/>
              </g>
              <g id="Polygon 2" filter="url(#filter1_f_2003_18)">
                <path d="M122.617 92.7667C154.219 84.299 183.136 113.217 174.669 144.818V144.818C166.201 176.42 126.699 187.005 103.565 163.871V163.871C80.4308 140.736 91.0154 101.234 122.617 92.7667V92.7667Z" fill="url(#paint1_linear_2003_18)"/>
              </g>
            </g>
            
            {/* Star Group - Individual paths sparkle via CSS */}
            <g id="star">
              {/* Note: Changed IDs to underscores to make CSS selection easier */}
              <path id="Star_1" d="M147.648 138.63C147.648 138.63 149.331 137.625 149.586 138.63L151.238 145.124C152.588 150.436 156.914 154.471 162.307 155.449L167.192 156.335C168.287 156.533 168.287 158.104 167.192 158.302L162.307 159.188C156.914 160.166 152.588 164.201 151.238 169.513L149.586 176.007C149.331 177.012 147.903 177.012 147.648 176.007L145.996 169.513C144.646 164.201 140.319 160.166 134.927 159.188L130.042 158.302C128.947 158.104 128.947 156.533 130.042 156.335L134.927 155.449C140.319 154.471 144.646 150.436 145.996 145.124L147.648 138.63Z" fill="url(#paint2_linear_2003_18)"/>
              <path id="Star_3" d="M108.212 123.428C108.448 122.486 109.786 122.486 110.022 123.428L110.234 124.273C111.369 128.798 115.077 132.222 119.679 132.992C120.612 133.148 120.612 134.489 119.679 134.645C115.077 135.415 111.369 138.839 110.234 143.364L110.022 144.209C109.786 145.151 108.448 145.151 108.212 144.209L108 143.364C106.865 138.839 103.157 135.415 98.5553 134.645C97.6223 134.489 97.6223 133.148 98.5553 132.992C103.157 132.222 106.865 128.798 108 124.273L108.212 123.428Z" fill="url(#paint3_linear_2003_18)"/>
              <path id="Star_4" d="M135.922 94.7448C136.018 93.9202 137.215 93.9202 137.312 94.7448L137.897 99.7294C138.26 102.82 140.619 105.301 143.688 105.817L148.512 106.628C149.291 106.759 149.291 107.878 148.512 108.009L143.688 108.82C140.619 109.336 138.26 111.817 137.897 114.908L137.312 119.892C137.215 120.717 136.018 120.717 135.922 119.892L135.337 114.908C134.974 111.817 132.615 109.336 129.546 108.82L124.721 108.009C123.943 107.878 123.943 106.759 124.721 106.628L129.546 105.817C132.615 105.301 134.974 102.82 135.337 99.7294L135.922 94.7448Z" fill="url(#paint4_linear_2003_18)"/>
            </g>
          </g>
          <defs>
            <filter id="filter0_f_2003_18" x="-3.8147e-05" y="-7.62939e-06" width="266.814" height="266.814" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="17.135" result="effect1_foregroundBlur_2003_18"/>
            </filter>
            <filter id="filter1_f_2003_18" x="65.3884" y="65.5709" width="136.476" height="136.476" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="12.8512" result="effect1_foregroundBlur_2003_18"/>
            </filter>
            <linearGradient id="paint0_linear_2003_18" x1="54.776" y1="47.9455" x2="193.135" y2="232.529" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B1C2FF"/>
              <stop offset="1" stopColor="#F56AFF" stopOpacity="0.1"/>
            </linearGradient>
            <linearGradient id="paint1_linear_2003_18" x1="193.721" y1="73.7144" x2="73.5129" y2="193.923" gradientUnits="userSpaceOnUse">
              <stop offset="0.23" stopColor="#60C5FF" stopOpacity="0.75"/>
              <stop offset="0.53791" stopColor="#588AFF" stopOpacity="0.450087"/>
              <stop offset="1" stopColor="#0022FF" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="paint2_linear_2003_18" x1="148.617" y1="134.093" x2="148.617" y2="180.544" gradientUnits="userSpaceOnUse">
              <stop stopColor="#CDFF3D"/>
              <stop offset="0.22" stopColor="#E2F9FF"/>
              <stop offset="1" stopColor="#BAF3FF"/>
            </linearGradient>
            <linearGradient id="paint3_linear_2003_18" x1="109.117" y1="119.819" x2="109.117" y2="147.819" gradientUnits="userSpaceOnUse">
              <stop stopColor="#CDFF3D"/>
              <stop offset="0.22" stopColor="white"/>
              <stop offset="1" stopColor="white"/>
            </linearGradient>
            <linearGradient id="paint4_linear_2003_18" x1="136.617" y1="91.4614" x2="136.617" y2="123.176" gradientUnits="userSpaceOnUse">
              <stop stopColor="#CDFF3D"/>
              <stop offset="0.22" stopColor="white"/>
              <stop offset="1" stopColor="#FFF099"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

    </div>
  );
};

export default AnimatedLoader;