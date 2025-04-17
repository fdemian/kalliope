import React, { useRef } from 'react';
import TestComponentMock from './Kalliope/TestComponentMock';
import { render, screen } from '@testing-library/react';

describe('<Editor />', () => {
  it('Render', () => {
    //const containerRef = useRef(null);
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
  })
});
