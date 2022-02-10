import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {Icon} from '../../../components';
import Colors from '../../../utils/Colors';

const secondIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 1,
  stepStrokeCurrentColor: Colors.colors.primary,
  stepStrokeWidth: 1,
  separatorStrokeFinishedWidth: 1,
  stepStrokeFinishedColor: '#ffffff',
  stepStrokeUnFinishedColor: Colors.colors.primary,
  separatorFinishedColor: Colors.colors.primary,
  separatorUnFinishedColor: Colors.colors.primary,
  stepIndicatorFinishedColor: Colors.colors.primary,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
};

const getStepIndicatorIconConfig = ({position, stepStatus}) => {
  const iconConfig = {
    name: 'feed',
    color: stepStatus === 'finished' ? '#ffffff' : Colors.colors.primary,
    size: 14,
  };
  switch (position) {
    case 0: {
      iconConfig.name = 'check';
      break;
    }
    case 1: {
      iconConfig.name = 'location-on';
      break;
    }
    case 2: {
      iconConfig.name = 'payment';
      break;
    }
    case 3: {
      iconConfig.name = 'done-all';
      break;
    }

    default: {
      break;
    }
  }
  return iconConfig;
};

const OrderSteps = props => {
  const status = props.position;
  const [currentPage, setCurrentPage] = useState(status);
  const renderStepIndicator = params => (
    <Icon {...getStepIndicatorIconConfig(params)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        <StepIndicator
          customStyles={secondIndicatorStyles}
          stepCount={4}
          currentPosition={currentPage}
          renderStepIndicator={renderStepIndicator}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderSteps;
