import styled from 'styled-components';
import { layout, space, typography } from 'styled-system';
import { TextProps } from './types';

const getFontSize = ({ fontSize, small }: TextProps) => {
  return small ? '14px' : fontSize || '16px';
};

const Text = styled.div<TextProps>`
  font-size: ${getFontSize};
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  line-height: 1.5;
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${({ ellipsis }) =>
    ellipsis &&
    `white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;`}

  ${space}
  ${typography}
  ${layout}
`;

Text.defaultProps = {
  color: '#ffffff',
  small: false,
  ellipsis: false,
};

export default Text;
