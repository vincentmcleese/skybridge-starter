/**
 * Icon Components
 *
 * Reusable SVG icons for ChatGPT Apps.
 * These are inline React components - safe to use without external dependencies.
 *
 * Icons are sourced from:
 * - agent-resources/Iconography/ (official ChatGPT icons)
 * - Custom icons following ChatGPT's monochromatic, outlined style
 *
 * When adding new icons:
 * 1. Check agent-resources/Iconography/ for existing icons first
 * 2. Copy the SVG path data into a new component here
 * 3. Use `fill="currentColor"` or `stroke="currentColor"` so icons inherit text color
 * 4. Export the component for use in widgets
 *
 * For custom icons not in Iconography/:
 * - Keep them monochromatic (single color)
 * - Use outlined style (stroke-based, not filled)
 * - Match the 24x24 viewBox and 2px stroke width
 */

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * PiP Icon - Picture-in-Picture mode toggle
 * Source: agent-resources/Iconography/picture-in-picture.svg
 */
export function PipIcon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.7587 4H14.2413C15.0463 3.99999 15.7106 3.99998 16.2518 4.04419C16.8139 4.09012 17.3306 4.18868 17.816 4.43597C18.5686 4.81947 19.1805 5.43139 19.564 6.18404C19.8113 6.66937 19.9099 7.18608 19.9558 7.74817C20 8.28936 20 8.95372 20 9.75868V10C20 10.5523 19.5523 11 19 11C18.4477 11 18 10.5523 18 10V9.8C18 8.94342 17.9992 8.36113 17.9624 7.91104C17.9266 7.47262 17.8617 7.24842 17.782 7.09202C17.5903 6.7157 17.2843 6.40973 16.908 6.21799C16.7516 6.1383 16.5274 6.07337 16.089 6.03755C15.6389 6.00078 15.0566 6 14.2 6H7.8C6.94342 6 6.36113 6.00078 5.91104 6.03755C5.47262 6.07337 5.24842 6.1383 5.09202 6.21799C4.7157 6.40973 4.40973 6.7157 4.21799 7.09202C4.1383 7.24842 4.07337 7.47262 4.03755 7.91104C4.00078 8.36113 4 8.94342 4 9.8V13.2C4 14.0566 4.00078 14.6389 4.03755 15.089C4.07337 15.5274 4.1383 15.7516 4.21799 15.908C4.40973 16.2843 4.7157 16.5903 5.09202 16.782C5.24842 16.8617 5.47262 16.9266 5.91104 16.9624C6.36113 16.9992 6.94342 17 7.8 17H9C9.55229 17 10 17.4477 10 18C10 18.5523 9.55229 19 9 19H7.75873C6.95374 19 6.28938 19 5.74817 18.9558C5.18608 18.9099 4.66937 18.8113 4.18404 18.564C3.43139 18.1805 2.81947 17.5686 2.43597 16.816C2.18868 16.3306 2.09012 15.8139 2.04419 15.2518C1.99998 14.7106 1.99999 14.0463 2 13.2413V9.7587C1.99999 8.95373 1.99998 8.28937 2.04419 7.74817C2.09012 7.18608 2.18868 6.66937 2.43597 6.18404C2.81947 5.43139 3.43139 4.81947 4.18404 4.43597C4.66937 4.18868 5.18608 4.09012 5.74817 4.04419C6.28937 3.99998 6.95373 3.99999 7.7587 4ZM15.968 13H18.032C18.4706 13 18.8491 13 19.1624 13.0214C19.4922 13.0439 19.8221 13.0934 20.1481 13.2284C20.8831 13.5328 21.4672 14.1169 21.7716 14.852C21.9066 15.1779 21.9561 15.5078 21.9787 15.8376C22 16.1509 22 16.5294 22 16.968V17.032C22 17.4706 22 17.8491 21.9787 18.1624C21.9561 18.4922 21.9066 18.8221 21.7716 19.1481C21.4672 19.8831 20.8831 20.4672 20.1481 20.7716C19.8221 20.9066 19.4922 20.9561 19.1624 20.9787C18.8491 21 18.4706 21 18.032 21H15.968C15.5294 21 15.1509 21 14.8376 20.9787C14.5078 20.9561 14.1779 20.9066 13.852 20.7716C13.1169 20.4672 12.5328 19.8831 12.2284 19.1481C12.0934 18.8221 12.0439 18.4922 12.0214 18.1624C12 17.8491 12 17.4706 12 17.032V16.968C12 16.5294 12 16.1509 12.0214 15.8376C12.0439 15.5078 12.0934 15.1779 12.2284 14.852C12.5328 14.1169 13.1169 13.5328 13.852 13.2284C14.1779 13.0934 14.5078 13.0439 14.8376 13.0214C15.1509 13 15.5294 13 15.968 13ZM14.9738 15.0167C14.7458 15.0323 14.6589 15.0589 14.6173 15.0761C14.3723 15.1776 14.1776 15.3723 14.0761 15.6173C14.0589 15.6589 14.0323 15.7458 14.0167 15.9738C14.0005 16.2107 14 16.5204 14 17C14 17.4796 14.0005 17.7893 14.0167 18.0262C14.0323 18.2542 14.0589 18.3411 14.0761 18.3827C14.1776 18.6277 14.3723 18.8224 14.6173 18.9239C14.6589 18.9411 14.7458 18.9677 14.9738 18.9833C15.2107 18.9995 15.5204 19 16 19H18C18.4796 19 18.7893 18.9995 19.0262 18.9833C19.2542 18.9677 19.3411 18.9411 19.3827 18.9239C19.6277 18.8224 19.8224 18.6277 19.9239 18.3827C19.9411 18.3411 19.9677 18.2542 19.9833 18.0262C19.9995 17.7893 20 17.4796 20 17C20 16.5204 19.9995 16.2107 19.9833 15.9738C19.9677 15.7458 19.9411 15.6589 19.9239 15.6173C19.8224 15.3723 19.6277 15.1776 19.3827 15.0761C19.3411 15.0589 19.2542 15.0323 19.0262 15.0167C18.7893 15.0005 18.4796 15 18 15H16C15.5204 15 15.2107 15.0005 14.9738 15.0167Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Collapse Icon - Dock/minimize mode toggle
 * Source: agent-resources/Iconography/collapse-sm.svg
 */
export function CollapseIcon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5 14C5 13.4477 5.44772 13 6 13H10C10.5523 13 11 13.4477 11 14V18C11 18.5523 10.5523 19 10 19C9.44771 19 9 18.5523 9 18V15H6C5.44772 15 5 14.5523 5 14Z"
        fill="currentColor"
      />
      <path
        d="M14 5C14.5523 5 15 5.44772 15 6V9H18C18.5523 9 19 9.44771 19 10C19 10.5523 18.5523 11 18 11H14C13.4477 11 13 10.5523 13 10V6C13 5.44772 13.4477 5 14 5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Expand Icon - Fullscreen or expand toggle
 * Source: agent-resources/Iconography/expand-md.svg
 */
export function ExpandIcon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 14C4 13.4477 4.44772 13 5 13C5.55228 13 6 13.4477 6 14V18H10C10.5523 18 11 18.4477 11 19C11 19.5523 10.5523 20 10 20H5C4.44772 20 4 19.5523 4 19V14Z"
        fill="currentColor"
      />
      <path
        d="M14 4C13.4477 4 13 4.44772 13 5C13 5.55228 13.4477 6 14 6H18V10C18 10.5523 18.4477 11 19 11C19.5523 11 20 10.5523 20 10V5C20 4.44772 19.5523 4 19 4H14Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Close Icon - Dismiss/close actions
 * Source: agent-resources/Iconography/x-circle, crossed, close.svg
 */
export function CloseIcon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9.70711 8.29289C9.31658 7.90237 8.68342 7.90237 8.29289 8.29289C7.90237 8.68342 7.90237 9.31658 8.29289 9.70711L10.5858 12L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L12 13.4142L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13.4142 12L15.7071 9.70711C16.0976 9.31658 16.0976 8.68342 15.7071 8.29289C15.3166 7.90237 14.6834 7.90237 14.2929 8.29289L12 10.5858L9.70711 8.29289Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Sun Icon - Light theme toggle
 * Custom icon following ChatGPT's monochromatic, outlined style
 */
export function SunIcon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Center circle */}
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      {/* Sun rays */}
      <path
        d="M12 2V4M12 20V22M4 12H2M6.31 6.31L4.9 4.9M17.69 6.31L19.1 4.9M6.31 17.69L4.9 19.1M17.69 17.69L19.1 19.1M22 12H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Moon Icon - Dark theme toggle
 * Custom icon following ChatGPT's monochromatic, outlined style
 */
export function MoonIcon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

