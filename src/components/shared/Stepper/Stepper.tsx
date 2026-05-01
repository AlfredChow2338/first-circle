import * as stepperStyles from "src/styles/stepper.css";

export type StepperStep = {
  title: string;
  description?: string;
};

type StepperProps = {
  steps: StepperStep[];
  activeStep: number;
  ariaLabel?: string;
};

function getStepState(index: number, activeStep: number): "completed" | "active" | "waiting" {
  if (index + 1 < activeStep) {
    return "completed";
  }
  if (index + 1 === activeStep) {
    return "active";
  }
  return "waiting";
}

export function Stepper({ steps, activeStep, ariaLabel = "Progress steps" }: StepperProps) {
  return (
    <ol className={stepperStyles.stepper} aria-label={ariaLabel}>
      {steps.map((step, index) => {
        const state = getStepState(index, activeStep);
        const isLastItem = index === steps.length - 1;
        const lineState = state === "completed" ? "completed" : state === "active" ? "active" : "waiting";

        return (
          <li key={step.title} className={stepperStyles.stepItem} data-state={state}>
            <div className={stepperStyles.stepHeader}>
              <span className={`${stepperStyles.marker} ${stepperStyles.markerState[state]}`}>{index + 1}</span>
              <span className={stepperStyles.title}>{step.title}</span>
              {!isLastItem ? (
                <span
                  className={`${stepperStyles.headerConnector} ${stepperStyles.headerConnectorState[lineState]}`}
                  aria-hidden="true"
                />
              ) : null}
            </div>
            {step.description ? <p className={stepperStyles.description}>{step.description}</p> : null}
            {!isLastItem ? (
              <span
                className={`${stepperStyles.stepTailConnector} ${stepperStyles.stepTailConnectorState[lineState]}`}
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
