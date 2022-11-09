import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Menu, Provider } from 'react-native-paper';

const MenuExample = () => {
const [visible, setVisible] = useState(false);

const closeMenu = () => setVisible(false);
const openMenu = (v) => setVisible(true);
return (
	<Provider>
	<View style={styles.container}>
		<Menu
		visible={visible}
		onDismiss={closeMenu}
		anchor={
			<Button onPress={openMenu} mode="outlined">
			Show menu
			</Button>
		}>
		<Menu.Item
			onPress={() => {
			Alert.alert('Action : ', 'Print');
			}}
			title="Print"
		/>
		<Menu.Item
			onPress={() => {
			Alert.alert('Action : ', 'Forward');
			}}
			title="Forward"
		/>
		<Menu.Item
			onPress={() => {
			Alert.alert('Action : ', 'Backward');
			}}
			title="Backward"
		/>
		<Menu.Item
			onPress={() => {
			Alert.alert('Action :', 'Save');
			}}
			title="Save"
		/>
		</Menu>
	</View>
	</Provider>
);
};

export default MenuExample;

const styles = StyleSheet.create({
container: {
	padding: 50,
	flexDirection: 'row',
	justifyContent: 'center',
	height: 200,
},
});
