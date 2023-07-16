import { styled, keyframes } from 'solid-styled-components';

const eyeShade = keyframes`
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(0.3125em); /* 5px */
  }
  40%, 50% {
    transform: translateY(-0.3125em); /* -5px */
  }
  60% {
    transform: translateY(-0.5em); /* -8px */
  }
  75% {
    transform: translateY(0.3125em); /* 5px */
  }
  100% {
    transform: translateY(0);
  }
`;

const eyeMove = keyframes`
  0% {
    transform: translate(0, 0);
  }
  20% {
    transform: translate(0em, 0.3125em); /* 5px */
  }
  40%, 50% {
    transform: translate(0em, -0.3125em); /* -5px */
  }
  60% {
    transform: translate(-0.625em, -0.3125em); /* -10px, -5px */
  }
  75% {
    transform: translate(-1.25em, 0.3125em); /* -20px, 5px */
  }
  100% {
    transform: translate(0, 0);
  }
`;

const StyledContainer = styled.div`
  font-size: 1rem; /* Set base size */
`;

const StyledEyesLoader = styled.div`
  position: relative;
  width: 3em; /* 48px */
  height: 3em; /* 48px */
  border-radius: 50%;
  box-sizing: border-box;
  background: #fff;
  border: 0.39em solid #131a1d; /* 6.24px */
  overflow: hidden;
  box-sizing: border-box;
  display: inline-block;

  margin-left: 1em;
  &:last-child {
    margin-left: 0.21875em; /* 3.5px */
  }

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: -50%;
    width: 100%;
    height: 100%;
    background: #263238;
    z-index: 5;
    border-bottom: 0.39em solid #131a1d; /* 6.24px */
    box-sizing: border-box;
    animation: ${eyeShade} 9s infinite;
    transition: all 0.2s ease;
  }

  &:before {
    content: '';
    position: absolute;
    left: 0.75em; /* 12px */
    bottom: 0.576em; /* 9.216px */
    width: 1.23em; /* 19.68px */
    z-index: 2;
    height: 1.23em; /* 19.68px */
    background: #111;
    border-radius: 50%;
    animation: ${eyeMove} 9s infinite;
    transition: all 0.2s ease;
  }
`;

export const Eyes = (props) => {
  return (
    <StyledContainer class={props.class}>
      <StyledEyesLoader />
      <StyledEyesLoader />
    </StyledContainer>
  );
}


// import { styled, keyframes } from 'solid-styled-components';

// const eyeShade = keyframes`
//   0% {
//     transform: translateY(0);
//   }
//   20% {
//     transform: translateY(5px);
//   }
//   40%, 50% {
//     transform: translateY(-5px);
//   }
//   60% {
//     transform: translateY(-8px);
//   }
//   75% {
//     transform: translateY(5px);
//   }
//   100% {
//     transform: translateY(0);
//   }
// `;

// const eyeMove = keyframes`
//   0% {
//     transform: translate(0, 0);
//   }
//   20% {
//     transform: translate(0px, 5px);
//   }
//   40%, 50% {
//     transform: translate(0px, -5px);
//   }
//   60% {
//     transform: translate(-10px, -5px);
//   }
//   75% {
//     transform: translate(-20px, 5px);
//   }
//   100% {
//     transform: translate(0, 0);
//   }
// `;

// const StyledContainer = styled.div`
//   --eyes-size: 48px;
//   --eyes-border-size: calc(var(--eyes-size) * 0.13);
//   --eyes-va1-1: calc(var(--eyes-size) * 0.25);
//   --eyes-va1-2: calc(var(--eyes-size) * 0.192);
//   --eyes-va1-3: calc(var(--eyes-size) * 0.41);
// `;

// const StyledEyesLoader = styled.div`
//   position: relative;
//   width: var(--eyes-size);
//   height: var(--eyes-size);
//   border-radius: 50%;
//   box-sizing: border-box;
//   background: #fff;
//   border: var(--eyes-border-size) solid #131a1d;
//   overflow: hidden;
//   box-sizing: border-box;
//   display: inline-block;

//   margin-left: 1rem;
//   &:last-child {
//     margin-left: 0.35rem;
//   }

//   &:after {
//     content: '';
//     position: absolute;
//     left: 0;
//     top: -50%;
//     width: 100%;
//     height: 100%;
//     background: #263238 ;
//     z-index: 5;
//     border-bottom: var(--eyes-border-size) solid #131a1d;
//     box-sizing: border-box;
//     animation: ${eyeShade} 9s infinite;
//     transition: all 0.2s ease;
//   }

//   &:before {
//     content: '';
//     position: absolute;
//     left: var(--eyes-va1-1);
//     bottom: var(--eyes-va1-2);
//     width: var(--eyes-va1-3);
//     z-index: 2;
//     height: var(--eyes-va1-3);
//     background: #111;
//     border-radius: 50%;
//     animation: ${eyeMove} 9s infinite;
//     transition: all 0.2s ease;
//   }
// `;

// export const Eyes = (props) => {
//   return (
//     <StyledContainer class={props.class}>
//       <StyledEyesLoader />
//       <StyledEyesLoader />
//     </StyledContainer>
//   );
// }
