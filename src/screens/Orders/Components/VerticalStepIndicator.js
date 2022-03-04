import * as React from 'react';
import { StyleSheet, View,  FlatList } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { Text } from '../../../components';
import dummyData from './data';
import Moment from 'moment'

const stepIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 5,
  stepStrokeCurrentColor: '#fe7013',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#aaaaaa',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: '#000000',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
  labelColor: '#666666',
  labelSize: 12,
  currentStepLabelColor: '#fe7013',
};

export default function VerticalStepIndicator(props) {
  const [currentPage, setCurrentPage] = React.useState(0);
  const viewabilityConfig = React.useRef({ itemVisiblePercentThreshold: 40 })
    .current;

  const renderPage = (rowData) => {
    const item = rowData.item;
    return (
      <View style={styles.rowItem}>
        <Text type='subheading' style={styles.title}>{item.statusName}</Text>
        <Text style={styles.body}>{item.trackingComment}</Text>
        <Text style={styles.body}>{Moment(item.dated).format('DD-MM-YYYY')}</Text>
      </View>
    );
  };

  const onViewableItemsChanged = React.useCallback(({ viewableItems }) => {
    const visibleItemsCount = viewableItems.length;
    if (visibleItemsCount !== 0) {
      setCurrentPage(viewableItems[visibleItemsCount - 1].index);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        <StepIndicator
          customStyles={stepIndicatorStyles}
          stepCount={4}
          direction="vertical"
          currentPosition={currentPage}
          labels={props.data.map((item) => item.statusName)}
        />
      </View>
      <FlatList
        style={{ flexGrow: 1 }}
        data={props.data}
        renderItem={renderPage}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginTop:16,
    
  },
  stepIndicator: {
   // marginVertical: 50,
    paddingHorizontal: 15,
  },
  rowItem: {
    flex: 3,
    paddingVertical: 16,
  },
  title: {
    flex: 1,
    fontSize: 20,
    color: '#333333',
    paddingVertical: 16,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    fontSize: 15,
    color: '#606060',
    lineHeight: 24,
    marginRight: 8,
  },
});