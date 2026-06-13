// export default function Page() {
//   const data = JSON.parse('not valid json {{{');
//   return <div>{data.name}</div>;
// }

export default function Page() {
  try {
    const data = JSON.parse('not valid json {{{');
    return <div>{data.name}</div>;
  } catch (error) {
    return <div>Something went wrong</div>;
  }
}