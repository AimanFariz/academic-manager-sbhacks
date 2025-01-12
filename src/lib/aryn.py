// lib/aryn.ts
import { partition_file, convert_image_element } from 'aryn-sdk';

export async function processWithAryn(fileBuffer: Buffer) {
  const partitionedFile = await partition_file(
    fileBuffer,
    process.env.ARYN_API_KEY,
    {
      extract_images: true,
      extract_table_structure: true,
      use_ocr: true
    }
  );
  
  return partitionedFile.elements.filter(e => e.type === 'Image');
}
