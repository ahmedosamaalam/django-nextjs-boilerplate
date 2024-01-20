'use client';
import React from 'react';
import LTInput from '../common/input';
import { TableWrapper } from '../table/table';

export const Accounts = () => {
  return (
    <div className="p-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">All Accounts</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <LTInput placeholder="Search users" />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          {/* <AddUser /> */}
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper />
      </div>
    </div>
  );
};
