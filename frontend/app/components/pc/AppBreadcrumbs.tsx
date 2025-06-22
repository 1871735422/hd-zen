import { Breadcrumbs, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import { LINK_COLOR } from '../../constants';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function AppBreadcrumbs({ items }: AppBreadcrumbsProps) {
  return (
    <Breadcrumbs
      aria-label='breadcrumb'
      sx={{
        color: LINK_COLOR,
        mb: 4,
        pl: { xs: 2, sm: 0 },
        '& .MuiBreadcrumbs-separator': {
          mx: 1,
        },
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return isLast ? (
          <Typography key={index} color='text.primary'>
            {item.label}
          </Typography>
        ) : (
          <Link
            key={index}
            component={NextLink}
            href={item.href || '#'}
            underline='hover'
            color='inherit'
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
