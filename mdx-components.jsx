export function useMDXComponents(components) {
  return {
    h1: props => <h1 className="text-3xl font-bold mb-4" {...props} />,
    h2: props => <h2 className="text-2xl font-bold mb-3" {...props} />,
    p: props => <p className="mb-4" {...props} />,
    a: props => <a className="text-blue-500 hover:underline" {...props} />,
    ul: props => <ul className="list-disc pl-6 mb-4" {...props} />,
    // nanti tambah custom
    ...components,
  };
}
