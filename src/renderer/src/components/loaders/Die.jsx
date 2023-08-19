import { styled, keyframes } from 'solid-styled-components';

const rotateDie = keyframes`
  0% , 20% { transform: rotate(0deg); }
  30% , 40% { transform: rotate(90deg); }
  50% , 60% { transform: rotate(180deg); }
  70% , 80% { transform: rotate(270deg); }
  90%,  100% { transform: rotate(360deg); }
`;

const moveDie = keyframes`
  0% , 9% {
    background-position:
    var(--die-val-1-neg) var(--die-val-2-neg),  var(--die-val-1-neg) 0px, var(--die-val-1-neg) var(--die-val-2),
    var(--die-val-1) var(--die-val-2-neg),  var(--die-val-1) 0px,  var(--die-val-1) var(--die-val-2);
  }
  10% , 25% {
    background-position:
    0px var(--die-val-2-neg),  var(--die-val-1-neg) 0px, var(--die-val-1-neg) var(--die-val-2),
    var(--die-val-3) var(--die-val-2-neg),  var(--die-val-1) 0px,  var(--die-val-1) var(--die-val-2);
  }
  30% , 45% {
    background-position:
    0px var(--die-val-3-neg), var(--die-val-1-neg) var(--die-val-4), var(--die-val-1-neg) var(--die-val-1),
    var(--die-val-3) var(--die-val-2-neg), var(--die-val-1) var(--die-val-4), var(--die-val-1) var(--die-val-1);
  }
  50% , 65% {
    background-position:
    0px var(--die-val-3-neg), var(--die-val-1-neg) var(--die-val-3-neg), var(--die-val-1-neg) var(--die-val-1),
    var(--die-val-3) var(--die-val-1-neg), 0px var(--die-val-4), var(--die-val-1) var(--die-val-1);
  }
  70% , 85% {
    background-position:
    0px var(--die-val-3-neg), var(--die-val-1-neg) var(--die-val-3-neg), 0px var(--die-val-1),
    var(--die-val-3) var(--die-val-1-neg), 0px var(--die-val-4), var(--die-val-3) var(--die-val-1);
  }
  90% , 100% {
    background-position:
    0px var(--die-val-3-neg), var(--die-val-1-neg) var(--die-val-3-neg), 0px 0px,
    var(--die-val-3) var(--die-val-1-neg), 0px 0px, var(--die-val-3) var(--die-val-1);
  }
`;

const StyledDieLoader = styled.div`
  width: var(--die-size);
  height: var(--die-size);
  position: relative;
  border-radius: var(--die-pip-size);
  background-color: var(--die-color);
  background-image:
    radial-gradient(circle var(--die-pip-size), var(--die-pip-color) 100%, transparent 0),
    radial-gradient(circle var(--die-pip-size), var(--die-pip-color) 100%, transparent 0),
    radial-gradient(circle var(--die-pip-size), var(--die-pip-color) 100%, transparent 0),
    radial-gradient(circle var(--die-pip-size), var(--die-pip-color) 100%, transparent 0),
    radial-gradient(circle var(--die-pip-size), var(--die-pip-color) 100%, transparent 0),
    radial-gradient(circle var(--die-pip-size), var(--die-pip-color) 100%, transparent 0);
    background-repeat: no-repeat;
  animation: ${moveDie} var(--die-time-2) linear infinite , ${rotateDie} var(--die-time) linear infinite;
`;

export const DieLoader = (props) => {
  return (
    <StyledDieLoader />
  );
}
