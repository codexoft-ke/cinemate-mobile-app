import { FontWeights, Typography } from '@/constants/typography';
import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

export interface TextProps extends RNTextProps {
  variant?: keyof typeof Typography;
  weight?: keyof typeof FontWeights;
  color?: string;
  className?: string;
}

export function Text({ 
  variant = 'body', 
  weight,
  color,
  style,
  className,
  children,
  ...props 
}: TextProps) {
  const baseStyle = Typography[variant];
  
  const combinedStyle: TextStyle = {
    ...baseStyle,
    ...(weight && { fontFamily: FontWeights[weight] }),
    ...(color && { color }),
    ...(style as TextStyle),
  };

  return (
    <RNText 
      style={combinedStyle} 
      className={className}
      {...props}
    >
      {children}
    </RNText>
  );
}

// Convenient preset components
export const MovieTitle = ({ children, ...props }: Omit<TextProps, 'variant'>) => (
  <Text variant="movieTitle" {...props}>{children}</Text>
);

export const MovieSubtitle = ({ children, ...props }: Omit<TextProps, 'variant'>) => (
  <Text variant="movieSubtitle" {...props}>{children}</Text>
);

export const MovieDescription = ({ children, ...props }: Omit<TextProps, 'variant'>) => (
  <Text variant="movieDescription" {...props}>{children}</Text>
);

export const MovieRating = ({ children, ...props }: Omit<TextProps, 'variant'>) => (
  <Text variant="movieRating" {...props}>{children}</Text>
);

export const Heading1 = ({ children, ...props }: Omit<TextProps, 'variant'>) => (
  <Text variant="h1" {...props}>{children}</Text>
);

export const Heading2 = ({ children, ...props }: Omit<TextProps, 'variant'>) => (
  <Text variant="h2" {...props}>{children}</Text>
);

export const Heading3 = ({ children, ...props }: Omit<TextProps, 'variant'>) => (
  <Text variant="h3" {...props}>{children}</Text>
);

export const Heading4 = ({ children, ...props }: Omit<TextProps, 'variant'>) => (
  <Text variant="h4" {...props}>{children}</Text>
);

export const BodyText = ({ children, ...props }: Omit<TextProps, 'variant'>) => (
  <Text variant="body" {...props}>{children}</Text>
);

export const CaptionText = ({ children, ...props }: Omit<TextProps, 'variant'>) => (
  <Text variant="caption" {...props}>{children}</Text>
);

export const SmallText = ({ children, ...props }: Omit<TextProps, 'variant'>) => (
  <Text variant="small" {...props}>{children}</Text>
);
