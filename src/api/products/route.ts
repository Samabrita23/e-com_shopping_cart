import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    // Find the correct path to the public directory
    const jsonDirectory = path.join(process.cwd(), 'public');

    // Check if the products.json file exists
    const filePath = path.join(jsonDirectory, 'products.json');
    await fs.access(filePath);

    // Read the JSON data file
    const fileContents = await fs.readFile(filePath, 'utf8');

    // Try to parse the JSON data
    let jsonData;
    try {
      jsonData = JSON.parse(fileContents);
    } catch (jsonError) {
      console.error(`Error parsing JSON: ${jsonError}`);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 500 });
    }

    // Check if the parsed data is an object
    if (typeof jsonData !== 'object') {
      console.error('Invalid data type');
      return NextResponse.json({ error: 'Invalid data type' }, { status: 500 });
    }

    // Return the content of the data file in JSON format
    return NextResponse.json(jsonData);
  } catch (error) {
    if (error instanceof Error && error.name === 'ENOENT') {
      // If the file doesn't exist, return a 404 status code
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    } else {
      // For other errors, return a 500 status code
      console.error(`Error reading the products file: ${error}`);
      return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
    }
  }
}