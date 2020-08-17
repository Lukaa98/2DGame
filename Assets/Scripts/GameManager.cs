using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public GameObject levelwon;
    public GameObject levelLost;
    public GameObject PauseButton;
    public GameObject RestartButton;
    public GameObject Bird;
    public GameObject Bird1;
    public GameObject Bird2;
    
    bool controlBool = false;

    

public void LevelWon()

 {
    PauseButton.SetActive (false); 
    RestartButton.SetActive (false); 
    controlBool=true;
    levelwon.SetActive(true);
    Debug.Log("game Won");
    FindObjectOfType<SoundEffects>().WonSound();
        Bird2.SetActive (false); 

    Bird1.SetActive (false); 

    Bird.SetActive (false); 




 }

public void LevelLost()

 {
   if(controlBool == false){
    PauseButton.SetActive (false); 
    RestartButton.SetActive (false); 
    levelLost.SetActive(true);
    Debug.Log("level los12t ");
    FindObjectOfType<SoundEffects>().DeathSound();
 

       }
 }
}
