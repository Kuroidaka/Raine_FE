import styled from "styled-components";

const DateZoneLabel = (p) => {
  const { title, num, className } = p;

  return (
    <DateZoneLabelContainer className={className}>
      <div className="label text-dark">
        <span>{title}</span>
        <span> ({num})</span>
      </div>
    </DateZoneLabelContainer>
  );
};

export default DateZoneLabel;

const DateZoneLabelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  &.overdue {
    .label span {
      color: rgba(234, 84, 85, 1);
    }
  }

  .label {
    font-weight: 700;

    span {
      font-size: 1.5rem;

      &:nth-child(2) {
        padding: 0 5px;
      }
      &:nth-child(3) {
        font-size: 18px;
        font-weight: 900;
      }
    }
  }
`;
