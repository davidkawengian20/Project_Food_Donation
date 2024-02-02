import React, {useEffect, useState} from 'react';
import {Button} from 'react-native';
import DatePicker from 'react-native-date-picker';

export default () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Format the time without seconds
    const formattedTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    console.log(formattedTime);
  }, [date]);

  return (
    <>
      <Button title="Open" onPress={() => setOpen(true)} />
      <DatePicker
        modal
        open={open}
        locale="id"
        date={date}
        mode={'time'}
        onConfirm={selectedDate => {
          setOpen(false);

          // Extract the hour and minute from the selectedDate
          const selectedHour = selectedDate.getHours();
          const selectedMinute = selectedDate.getMinutes();

          // Create a new Date object with the current year, month, and day,
          // but with the selected hour and minute
          const newDate = new Date();
          newDate.setHours(selectedHour, selectedMinute);

          // Update the state with the new Date object
          setDate(newDate);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};
