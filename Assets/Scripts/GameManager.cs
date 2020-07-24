using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public GameObject levelwon;
    public GameObject levelLost;
    public GameObject RestartButton;
    public GameObject PauseButton;
    
    bool controlBool = false;

    

public void LevelWon()

 {

    PauseButton.SetActive (false); 
    RestartButton.SetActive (false); 
    controlBool=true;
    levelwon.SetActive(true);
    Debug.Log("game Won");
    FindObjectOfType<AudioManager>().Play("Rock win");
    FindObjectOfType<SoundEffects>().DeathSound();

 }

public void LevelLost()

 {
   if(controlBool == false){
 
    PauseButton.SetActive (false); 
    RestartButton.SetActive (false); 
    levelLost.SetActive(true);
    Debug.Log("level los12t ");
//    FindObjectOfType<SoundEffects>().DeathSound();
 FindObjectOfType<AudioManager>().Play("Level Lost");
    FindObjectOfType<SoundEffects>().DeathSound();

                           }
 }
}
