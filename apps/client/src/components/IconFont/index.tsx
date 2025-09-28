import React from 'react';

import { createFromIconfontCN } from '@ant-design/icons';

export default function IconFont({
  type,
  size
}: {
  type: string;
  size?: number;
}) {
  const IconFont = createFromIconfontCN({
    scriptUrl: ['//at.alicdn.com/t/c/font_5012902_mqk19m7ahv.js']
  });
  return (
    <div>
      <IconFont type={type} style={{ fontSize: size }} />
    </div>
  );
}
