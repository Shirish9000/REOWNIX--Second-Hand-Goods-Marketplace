import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ImageDropzone from './ImageDropzone';

describe('ImageDropzone Component', () => {
  let setSelectedFiles;
  let setErrors;

  beforeEach(() => {
    setSelectedFiles = vi.fn();
    setErrors = vi.fn();

    // Mock URL object methods for JSDOM
    global.URL.createObjectURL = vi.fn((file) => `mock-url-${file.name}`);
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createMockFile = (name, sizeMB, type) => {
    const file = new File(['a'.repeat(sizeMB * 1024 * 1024)], name, { type });
    return file;
  };

  it('renders dropzone zone instructions correctly', () => {
    render(
      <ImageDropzone
        selectedFiles={[]}
        setSelectedFiles={setSelectedFiles}
        errors={[]}
        setErrors={setErrors}
      />
    );

    expect(
      screen.getByText(/Drag & drop images here, or click to select/i)
    ).toBeInTheDocument();
  });

  it('displays validation errors when errors prop is provided', () => {
    const errors = ['File size too large', 'Unsupported file format'];

    render(
      <ImageDropzone
        selectedFiles={[]}
        setSelectedFiles={setSelectedFiles}
        errors={errors}
        setErrors={setErrors}
      />
    );

    expect(screen.getByText('File size too large')).toBeInTheDocument();
    expect(screen.getByText('Unsupported file format')).toBeInTheDocument();
  });

  it('renders preview grid when selectedFiles are passed', () => {
    const selectedFiles = [
      {
        id: '1',
        preview: 'mock-url-1.jpg',
        file: { name: 'photo1.jpg' },
      },
      {
        id: '2',
        preview: 'mock-url-2.png',
        file: { name: 'photo2.png' },
      },
    ];

    render(
      <ImageDropzone
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        errors={[]}
        setErrors={setErrors}
      />
    );

    expect(screen.getByAltText('photo1.jpg')).toBeInTheDocument();
    expect(screen.getByAltText('photo2.png')).toBeInTheDocument();
  });

  it('allows removing an image from the preview list', () => {
    const selectedFiles = [
      {
        id: '1',
        preview: 'mock-url-1.jpg',
        file: { name: 'photo1.jpg' },
      },
    ];

    render(
      <ImageDropzone
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        errors={[]}
        setErrors={setErrors}
      />
    );

    const removeButton = screen.getByRole('button', { name: /remove photo1.jpg/i });
    fireEvent.click(removeButton);

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url-1.jpg');
    expect(setSelectedFiles).toHaveBeenCalled();
  });

  it('displays progress bar when uploadProgress prop is passed', () => {
    const selectedFiles = [
      {
        id: 'file-1',
        preview: 'mock-url-1.jpg',
        file: { name: 'photo1.jpg' },
      },
    ];

    const uploadProgress = {
      'file-1': 60,
    };

    render(
      <ImageDropzone
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        errors={[]}
        setErrors={setErrors}
        uploadProgress={uploadProgress}
      />
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '60');
  });

  it('handles dropping valid files correctly', async () => {
    const { container } = render(
      <ImageDropzone
        selectedFiles={[]}
        setSelectedFiles={setSelectedFiles}
        errors={[]}
        setErrors={setErrors}
      />
    );

    const input = container.querySelector('input[type="file"]');
    const validFile = createMockFile('test.jpg', 1, 'image/jpeg');

    fireEvent.change(input, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(setErrors).toHaveBeenCalledWith([]);
      expect(setSelectedFiles).toHaveBeenCalled();
    });
  });

  it('flags error when exceeding maximum file count', async () => {
    const existingFiles = [
      { id: '1', preview: 'p1', file: { name: '1.jpg' } },
      { id: '2', preview: 'p2', file: { name: '2.jpg' } },
      { id: '3', preview: 'p3', file: { name: '3.jpg' } },
      { id: '4', preview: 'p4', file: { name: '4.jpg' } },
      { id: '5', preview: 'p5', file: { name: '5.jpg' } },
    ];

    const { container } = render(
      <ImageDropzone
        selectedFiles={existingFiles}
        setSelectedFiles={setSelectedFiles}
        errors={[]}
        setErrors={setErrors}
      />
    );

    const input = container.querySelector('input[type="file"]');
    const extraFile = createMockFile('extra.jpg', 1, 'image/jpeg');

    fireEvent.change(input, { target: { files: [extraFile] } });

    await waitFor(() => {
      expect(setErrors).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.stringContaining('Maximum 5 images allowed'),
        ])
      );
    });
  });
});