type PageHeaderProps = {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  children,
}) => (
  <div className="page-header w-full flex justify-between items-center py-6 ">
    <div className="info">
      <h1 className="text-2xl pb-2">{title}</h1>
      <h2>{subtitle}</h2>
    </div>
    {children ? <div className="actions">{children}</div> : null}
  </div>
);

export default PageHeader;
