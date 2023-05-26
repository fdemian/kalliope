import React, { useRef } from 'react';
import TestComponentMock from './Calliope/TestComponentMock';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('<Editor />', () => {
  it('Render', () => {

    //const containerRef = useRef(null);
    const containerFn = () => {

    };

    render(
    <TestComponentMock
      containerRef={() => jest.fn()}
      setFormats={jest.fn()}
      onSearchChange={jest.fn()}
      onAddMention={jest.fn()}
      onRemoveMention={jest.fn()}
      mentionsData={[]}
    />
    );
    screen.debug(undefined, 300000000);
  })
});
