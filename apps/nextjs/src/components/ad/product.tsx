const Product = ({ title, url }: { title: string; url: string }) => {
  return (
    <iframe
      src={url}
      title={title}
      className="w-full min-w-[120px]"
      width="120"
      height="240"
      referrerPolicy="unsafe-url"
    ></iframe>
  );
};

export default Product;
