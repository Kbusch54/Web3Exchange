'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className='text-center p-64 text-white text-2xl'>
      <h2>Something went wrong!</h2>
      <button className='px-4 py-2 bg-blue-500 rounded-full mt-4'
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
        <p>{error.name}</p>
      <p>{error.message}</p>
    </div>
  )
}