'use client';

import { useEffect, useRef } from 'react';
import { PageFlip } from 'page-flip';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

export default function PdfFlipbookModal({ isOpen = true, onClose, pages = [], preview = false }) {
  const bookRef = useRef(null);
  const flipRef = useRef(null);

  useEffect(() => {
    if (isOpen && bookRef.current && pages.length > 0) {
      if (flipRef.current) {
        flipRef.current.destroy();
      }

      flipRef.current = new PageFlip(bookRef.current, {
        width: preview ? 300 : 400,
        height: preview ? 400 : 600,
        size: 'fixed',
        maxShadowOpacity: 0.5,
        showCover: true,
        mobileScrollSupport: false,
      });

      flipRef.current.loadFromHTML(document.querySelectorAll(`.${preview ? 'preview-page' : 'page'}`));
    }

    return () => {
      if (flipRef.current) {
        flipRef.current.destroy();
        flipRef.current = null;
      }
    };
  }, [isOpen, pages, preview]);

  const container = (
    <div
      id="book"
      ref={bookRef}
      className="flex justify-center items-center mx-auto"
    >
      {pages.map((page, index) => (
        <div
          key={index}
          className={`${preview ? 'preview-page w-[300px] h-[400px]' : 'page w-[400px] h-[600px]'} flex items-center justify-center text-black bg-white border`}
        >
          <img src={page} alt={`Page ${index + 1}`} className="w-full h-full object-contain" />
        </div>
      ))}
    </div>
  );

  if (preview) return container;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-70" aria-hidden="true" />
      <div className="fixed inset-0 flex justify-center items-center p-4">
        <Dialog.Panel className="relative bg-white rounded-lg shadow-lg max-w-5xl w-full h-auto overflow-hidden">
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
          {container}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
