import React from 'react'
import {
    AppState,
    StyleSheet,
    Text,
    View
} from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
})

export default class App extends React.Component {
    constructor(props) {
        super(props)
        console.log(AppState.currentState)
        this.state = {
            appState: AppState.currentState,
            memoryWarnings: 0,
        }
    }
    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange.bind(this))
        AppState.addEventListener('memoryWarning', this.handleMemoryWarning.bind(this))
    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange.bind(this))
        AppState.removeEventListener('memoryWarning', this.handleMemoryWarning.bind(this))
    }

    handleAppStateChange(currentAppState) {
        console.log(currentAppState)
        this.setState({
            appState: currentAppState,
        })
    }

    handleMemoryWarning() {
        console.log('memory warning')
        this.setState({
            memoryWarnings: this.state.memoryWarnings + 1,
        })
    }

    render() {
        return (
          <View style={styles.container}>
            <Text style={styles.text}>{this.state.appState}</Text>
            <Text style={styles.text}>{this.state.memoryWarnings}</Text>
          </View>
        )
    }
}
