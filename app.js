import React from 'react'
import {
    AppState,
    AsyncStorage,
    StyleSheet,
    Text,
    View
} from 'react-native'
import { WRITE_BACK_EVENT } from './const'

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

const STORAGE_KEY = 'foo'

export default class App extends React.Component {
    constructor(props) {
        super(props)
        console.log(`--- ${AppState.currentState} ---`)
        this.state = {
            appState: AppState.currentState,
            memoryWarnings: 0,
        }
    }

    async data() {
        try {
            const data = await fetch('https://www.amazon.co.jp/')
            this.data = await data.text()
        } catch(error) {
            console.log(error)
        }
    }

    async componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange.bind(this))
        AppState.addEventListener('memoryWarning', this.handleMemoryWarning.bind(this))

        await this.read()
        await this.data()
        await this.write()
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange.bind(this))
        AppState.removeEventListener('memoryWarning', this.handleMemoryWarning.bind(this))
    }

    async handleAppStateChange(currentAppState) {
        console.log(`--- ${currentAppState} ---`)
        this.setState({
            appState: currentAppState,
        })

        if (currentAppState === 'active') {
            await this.read()
        }
        else if (currentAppState === WRITE_BACK_EVENT) {
            await this.write()
        }
    }

    async read() {
        try {
            console.log('reading')
            const value = await AsyncStorage.getItem(STORAGE_KEY)
            console.log('read')
            if (value !== null) {
                this.setState({
                    previousState: value.length,
                })
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    async write() {
        try {
            const base = new Date()
            console.log('writing')
            await AsyncStorage.setItem(STORAGE_KEY, this.data)
            console.log('written')
            console.log(new Date() - base)
        }
        catch (error) {
            console.log(error)
        }
    }

    async handleMemoryWarning() {
        console.log('--- memory warning ---')
        this.setState({
            memoryWarnings: this.state.memoryWarnings + 1,
        })
        await this.write()
    }

    render() {
        return (
          <View style={styles.container}>
            <Text style={styles.text}>{this.state.appState}</Text>
            <Text style={styles.text}>
              memory warnings: {this.state.memoryWarnings}
            </Text>
            <Text style={styles.text}>
              written {this.state.previousState} bytes on previous
            </Text>
          </View>
        )
    }
}
