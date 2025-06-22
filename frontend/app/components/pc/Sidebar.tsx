import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

interface SidebarItem {
  id: number;
  title: string;
  subtitle?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItemId: number;
  onItemClick: (id: number) => void;
}

export default function Sidebar({
  items,
  activeItemId,
  onItemClick,
}: SidebarProps) {
  return (
    <Box
      sx={{
        width: 260,
        minHeight: 750,
        p: '12px',
        background:
          'linear-gradient(175.97deg, rgba(232, 247, 255, 1) 0%, rgba(224, 226, 255, 1) 99.94%)',
        borderRadius: 4,
      }}
    >
      <List sx={{ p: 0 }}>
        {items.map(item => {
          const isActive = item.id === activeItemId;
          return (
            <ListItem
              key={item.id}
              disablePadding
              sx={{
                mb: 1,
                bgcolor: isActive ? 'common.white' : 'transparent',
                borderRadius: '24px',
                boxShadow: isActive
                  ? '0px 4px 12px rgba(100, 100, 100, 0.08)'
                  : 'none',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemButton
                onClick={() => onItemClick(item.id)}
                sx={{
                  borderRadius: '24px',
                  py: '12px',
                  px: '16px',
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isActive
                        ? 'rgba(84, 130, 248, 1)'
                        : 'rgba(218, 227, 243, 1)',
                      color: isActive
                        ? 'common.white'
                        : 'rgba(84, 130, 248, 1)',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {item.id}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.subtitle}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: 'text.primary',
                    fontSize: '16px',
                  }}
                  secondaryTypographyProps={{
                    color: 'text.secondary',
                    fontSize: '14px',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
