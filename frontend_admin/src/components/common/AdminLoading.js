import React from 'react';

const AdminLoading = ({
  fullScreen = false,
  label = 'Loading',
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex min-h-[180px] items-center justify-center" role="status" aria-live="polite">
        <div className="text-center">
          <div className="admin-loader-ring mx-auto h-10 w-10" />
          <p className="mt-3 text-xs font-semibold text-slate-500">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${fullScreen ? 'fixed inset-0 z-[100]' : 'absolute inset-0 z-30'} flex items-center justify-center bg-[#f4f7fb]/95 backdrop-blur-sm`}
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="admin-loader-ring mx-auto h-14 w-14 shadow-lg shadow-blue-900/10" />
        <p className="mt-4 text-sm font-semibold text-slate-600">{label}</p>
      </div>
    </div>
  );
};

export default AdminLoading;
