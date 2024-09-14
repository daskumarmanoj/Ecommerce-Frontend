import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

// Import your custom images
import image1 from "../assets/image/5092393.jpg";
import image2 from "../assets/image/4669213.jpg";
import image3 from "../assets/image/5565175.jpg";
import image4 from "../assets/image/5565179.jpg";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  {
    imgPath: image1,
  },
  {
    imgPath: image2,
  },
  {
    imgPath: image3,
  },
  {
    imgPath: image4,
  },
];

function SwipeableTextMobileStepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ maxWidth: "100%", flexGrow: 1, margin: 0, padding: 0 }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          height: 50,
          pl: 2,
          bgcolor: "background.default",
          margin: 0,
          padding: 0,
        }}
      ></Paper>
      <AutoPlaySwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        style={{ margin: 0, padding: 0 }}
        containerStyle={{ margin: 0, padding: 0 }}
      >
        {images.map((step, index) => (
          <div key={step.imgPath} style={{ margin: 0, padding: 0 }}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component="img"
                sx={{
                  height: 350,
                  display: "block",
                  maxWidth: "100%",
                  overflow: "hidden",
                  width: "100%",
                  objectFit: "cover",
                  margin: 0,
                  padding: 0,
                }}
                src={step.imgPath}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{
          display: 'none', // Hides the dots
          margin: 0,
          padding: 0,
        }}
      />
    </Box>
  );
}

export default SwipeableTextMobileStepper;
