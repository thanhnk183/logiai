import { Fragment } from 'react';
import type { StepState } from '../../types';

/** Vòng đời một lô hàng, dùng chung cho Trang chủ và module Job */
export const LIFECYCLE_STEPS = ['Booking', 'Lấy hàng', 'Hải quan', 'Khởi hành', 'Đến', 'Giao', 'Hóa đơn'];

const stateLabel: Record<StepState, string> = { done: 'Xong', doing: 'Đang làm', late: 'Trễ', todo: 'Chưa tới' };

interface LifecycleStepperProps {
  steps: StepState[];
  /** compact: chỉ chấm, không nhãn (dùng trong bảng) · wide: bước rộng hơn (dùng ở chi tiết job) */
  size?: 'compact' | 'normal' | 'wide';
}

export function LifecycleStepper({ steps, size = 'normal' }: LifecycleStepperProps) {
  return (
    <div className={`stepper stepper--${size}`}>
      {steps.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && <span className={`stepper__line ${steps[i - 1] === 'done' && s !== 'todo' ? 'is-done' : ''}`} />}
          <div className={`stepper__step is-${s}`} title={`${LIFECYCLE_STEPS[i]}: ${stateLabel[s]}`}>
            <span className="stepper__dot" />
            {size !== 'compact' && <span className="stepper__label">{LIFECYCLE_STEPS[i]}</span>}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
