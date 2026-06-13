// export default function Page() {
//   const data = JSON.parse('not valid json {{{');
//   return <div>{data.name}</div>;
// }


import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    const run = async () => {
      try {
        // your async logic
      } catch (err) {
        console.error('Async effect failed:', err);
      }
    };

    run();
  }, []);

  return <div>async effect error</div>;
}