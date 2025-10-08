import React from 'react';

import { Table } from '../ui/table';

const RecentShippments = () => {
  return (
    <div>
      <h1 className="font-bold text-[hsl(var(--primary))]">
        Recent Shippments
      </h1>
      <Table data={[]} columns={[]} />
    </div>
  );
};

export default RecentShippments;
