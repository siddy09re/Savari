import React from 'react';
import styled from 'styled-components';

const ButtonLoader = () => {
  return (
    <StyledWrapper>
      <div className="custom-loader" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .custom-loader {
    width: 1.2rem;
    height: 1.2rem;
    display: grid;
    border-radius: 50%;
    -webkit-mask: radial-gradient(farthest-side, #0000 40%, #000 41%);
    background:
      linear-gradient(0deg, #766df480 50%, #766df4ff 0) center/3px 100%,
      linear-gradient(90deg, #766df440 50%, #766df4bf 0) center/100% 3px;
    background-repeat: no-repeat;
    animation: s3 1s infinite steps(12);
  }

  .custom-loader::before,
  .custom-loader::after {
    content: "";
    grid-area: 1/1;
    border-radius: 50%;
    background: inherit;
    opacity: 0.915;
    transform: rotate(30deg);
  }

  .custom-loader::after {
    opacity: 0.83;
    transform: rotate(60deg);
  }

  @keyframes s3 {
    100% {
      transform: rotate(1turn);
    }
  }
`;

export default ButtonLoader;
