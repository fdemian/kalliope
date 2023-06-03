import { useState } from 'react';
import './Spoiler.css';

type SpoilerProps = {
  text: string;
}

const Spoiler = ({ text }: SpoilerProps) => {
  const [textStatus, setTextStatus] = useState('Concealed');
  const cssClass = `Spoiler ${textStatus}`;

  const changeStatus = () => {
    const newStatus = textStatus === '' ? 'Concealed' : '';
    setTextStatus(newStatus);
  };

  return (
    <span className={cssClass} onClick={changeStatus} role="presentation">
      {text}
    </span>
  );
};

export default Spoiler;
